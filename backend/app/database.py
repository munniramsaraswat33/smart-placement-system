import os
import socket
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("placement_system.database")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def is_port_open(host: str, port: int, timeout: float = 0.3) -> bool:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception:
        return False

def get_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("sqlite"):
            engine = create_engine(db_url, connect_args={"check_same_thread": False})
            logger.info("Connected to SQLite database: %s", db_url)
            return engine
        
        # Fast socket check before waiting for slow TCP timeout
        port = int(settings.DB_PORT) if settings.DB_PORT.isdigit() else 3306
        if not is_port_open(settings.DB_HOST, port, timeout=0.2):
            raise ConnectionError(f"Port {port} on {settings.DB_HOST} is not reachable.")

        # Test connection to MySQL
        engine = create_engine(
            db_url, 
            connect_args={"connect_timeout": 2}, 
            pool_pre_ping=True, 
            pool_recycle=3600
        )
        with engine.connect() as conn:
            pass
        logger.info("Successfully connected to MySQL database: %s", settings.DB_NAME)
        return engine
    except Exception as e:
        logger.info(
            "MySQL not running at %s:%s (%s). Using local SQLite for instantaneous demo execution.",
            settings.DB_HOST, settings.DB_PORT, str(e)
        )
        sqlite_url = "sqlite:///./placement_system.db"
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        return engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
