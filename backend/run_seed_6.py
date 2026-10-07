import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        with open('sql/006_prevent_idle.sql', 'r') as f:
            sql = f.read()
            # We use conn.execution_options(autocommit=True) for CREATE EXTENSION
            conn.execute(text(sql))
            conn.commit()
    print("Seed 006 (prevent idle) completed!")

if __name__ == "__main__":
    main()
