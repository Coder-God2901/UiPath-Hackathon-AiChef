from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = 'data/sample_bills'
    app.config['OUTPUT_FOLDER'] = 'data/outputs'

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app
