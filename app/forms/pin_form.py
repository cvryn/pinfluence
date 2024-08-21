from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DecimalField, SelectField
from wtforms.validators import DataRequired, Length, NumberRange, URL

class PinForm(FlaskForm):
    image_url = StringField('Pin Image', validators=[DataRequired(), URL(message = "Must be a valid URL")])
    title = StringField('Title', validators=[DataRequired(), Length(
                min=2, max=100, message="Title must be between 2 and 50 characters."
            )])
    description = StringField(
        "Description",
        validators=[
            # DataRequired(),
            Length(
                max=255,
                message="Description cannot exceed 255 characters.",
            ),
        ],
    )
    tags = SelectField(
        "Tags",
        choices=[],
        validators=[],
    )