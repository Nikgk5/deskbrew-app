import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        with open('sql/005_seed_more_places.sql', 'r') as f:
            sql = f.read()
            conn.execute(text(sql))
            conn.commit()
    print("Seed 005 completed!")

if __name__ == "__main__":
    main()
