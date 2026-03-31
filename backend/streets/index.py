import json
import os
from urllib.parse import urlparse, unquote
import pg8000.native


def get_conn():
    dsn = os.environ['DATABASE_URL']
    p = urlparse(dsn)
    return pg8000.native.Connection(
        user=unquote(p.username),
        password=unquote(p.password),
        host=p.hostname,
        port=p.port or 5432,
        database=p.path.lstrip('/')
    )


def handler(event: dict, context) -> dict:
    """Возвращает список улиц или одну улицу по id для проекта Улицы Благовещенска."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    params = event.get('queryStringParameters') or {}
    street_id = params.get('id', '').strip()
    search = params.get('search', '').strip()

    conn = get_conn()

    if street_id:
        safe_id = street_id.replace("'", "''")
        rows = conn.run(
            f"SELECT id, name, era, year, description FROM streets WHERE id = '{safe_id}'"
        )
        conn.close()
        if not rows:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Улица не найдена'}, ensure_ascii=False)
            }
        r = rows[0]
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'street': {'id': r[0], 'name': r[1], 'era': r[2], 'year': r[3], 'description': r[4]}}, ensure_ascii=False)
        }

    if search:
        safe = search.replace("'", "''")
        rows = conn.run(
            f"SELECT id, name, era, year, description FROM streets WHERE name ILIKE '%{safe}%' ORDER BY name"
        )
    else:
        rows = conn.run("SELECT id, name, era, year, description FROM streets ORDER BY name")

    conn.close()

    streets = [
        {'id': r[0], 'name': r[1], 'era': r[2], 'year': r[3], 'description': r[4]}
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'streets': streets}, ensure_ascii=False)
    }