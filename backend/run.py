import os
import sys

# Ensure Cython extensions don't trigger AppLocker issues
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
