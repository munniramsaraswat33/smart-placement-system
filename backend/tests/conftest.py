import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"
os.environ["DATABASE_URL"] = "sqlite:///./test_placement.db"

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.seed_data import seed_all_data

TEST_DB_URL = "sqlite:///./test_placement.db"
test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    db = TestSessionLocal()
    seed_all_data(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_placement.db"):
        try:
            os.remove("./test_placement.db")
        except Exception:
            pass

@pytest.fixture
def db():
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()
