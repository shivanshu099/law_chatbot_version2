from db import Base
from sqlalchemy import Column,Integer,String

class User(Base):
    __tablename__="users"
    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,unique=True,index=True,nullable=False)
    password=Column(String,nullable=False)










