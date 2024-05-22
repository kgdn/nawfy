import base64

from flask import request


def convert_icon_path_to_base64(icon_path):
    """Converts an icon path to a base64 string.

    Args:
        icon_path (str): The icon path.

    Returns:
        str: The base64 string.
    """
    with open(icon_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def get_user_ip_addr():
    """Gets the user's IP address.

    Returns:
        str: The user's IP address.
    """
    return request.remote_addr
