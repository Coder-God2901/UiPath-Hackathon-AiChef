// pages/api/process-bill.js
import formidable from 'formidable';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

// Disable Next.js default body parser (required for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'data', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: 'File upload failed' });
    }

    try {
      console.log("FIELDS:", fields);
      console.log("FILES:", files);

      // use 'bill' instead of 'file'
      const filePath = files?.bill?.[0]?.filepath;
      if (!filePath) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const scriptPath = path.join(process.cwd(), "grocery-bill-ai", "process_bill.py");
      const { stdout, stderr } = await execAsync(`python "${scriptPath}" "${filePath}"`);
      if (stderr) console.error("Python error:", stderr);
      

      res.status(200).json({
        message: 'File processed successfully',
        output: stdout,
        fields,
        files,
      });
    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({ error: 'Processing failed', details: error.message });
    }
  });
}
