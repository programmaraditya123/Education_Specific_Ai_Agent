from fastmcp import FastMCP
from main import app

mcp = FastMCP.from_fastapi(
    app=app,
    name="All rounder mcp server",
    exclude=["/chat","/download","/upload","/ping"]
)

if __name__=="__main__":
    mcp.run()