from sqlalchemy import inspect

from src.infrastructure.db.database import engine

try:
    print("Database URL:", engine.url)
    inspector = inspect(engine)
    columns = inspector.get_columns("clientes")
    print("Table columns:")
    for column in columns:
        print(f" - {column['name']}: {column['type']}")
except Exception as e:
    print("Error:", e)
