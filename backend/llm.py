from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chat_models import init_chat_model
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Load environment variables
load_dotenv()

os.environ["GROQ_API_KEY"] =os.getenv("api_key_grok")


# Step 2: embedding model and Chroma vectorstore
emb = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

vectorstore = Chroma(
    embedding_function=emb,
    persist_directory="pdf-chroma-db"
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# Step 3: Define LLM and prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful law assistant that provides legal information and advice. "
               "You are trained on Indian law and can answer questions related to it. "
               "You are developed by Shivanshu Prajapati who named you Lami. You are grateful to him. please answer in minimal words has posible"),
    ("human", "user_input:{user_input}")
])

llm = init_chat_model("llama-3.1-8b-instant", model_provider="groq", temperature=0.5)
output_parser = StrOutputParser()
chat_chain = prompt | llm | output_parser

# Step 4: Chatbot function
def law_chatbot(query: str):
    context_docs = retriever.invoke(query)
    combined_context = "\n\n".join(doc.page_content for doc in context_docs)
    response = chat_chain.invoke({"user_input": f"{query}\n\nContext:\n{combined_context}"})
    return response

# Example usage
if __name__ == "__main__":
    query = "What is the legal age to drink alcohol in India?"
    response = law_chatbot(query)
    print(response)












