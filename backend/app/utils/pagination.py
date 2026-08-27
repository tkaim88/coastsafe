"""
Pagination helper.

Every paginated GET endpoint (safety reports, businesses) needs the same
three things: read page/per_page from the query string, clamp per_page to
a sane maximum, and shape the response the same way. Centralizing that
here means the response shape can never drift between endpoints.
"""

from flask import request, current_app


def paginate_query(query, serialize_fn):
    """
    Paginate a SQLAlchemy query using ?page= and ?per_page= query params.

    Returns a dict ready to be jsonify'd:
        {
          "items": [...],
          "page": 1,
          "per_page": 10,
          "total": 42,
          "total_pages": 5
        }
    """
    default_per_page = current_app.config["DEFAULT_PER_PAGE"]
    max_per_page = current_app.config["MAX_PER_PAGE"]

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=default_per_page, type=int)

    # Guard against nonsense or abusive query params rather than trusting
    # client input directly.
    page = max(page, 1)
    per_page = max(1, min(per_page, max_per_page))

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return {
        "items": [serialize_fn(item) for item in paginated.items],
        "page": paginated.page,
        "per_page": per_page,
        "total": paginated.total,
        "total_pages": paginated.pages,
    }
