import markdown


MARKDOWN_EXTENSIONS = [
    "extra",
    "sane_lists",
    "smarty",
]


def render_rich_text(value: str) -> str:
    if not value:
        return ""

    return markdown.markdown(value, extensions=MARKDOWN_EXTENSIONS)
