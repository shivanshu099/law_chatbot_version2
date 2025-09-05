from sqlalchemy import create_engine,Column,Integer,String
from sqlalchemy.orm  import sessionmaker,declarative_base

DATABASE_URL = "sqlite:///./users.db"  # use PostgreSQL/MySQL in production

engine=create_engine(DATABASE_URL,connect_args={"check_same_thread":False})
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()


