import os

# # List of filenames to create
# filenames = ["Index.tsx" , "NotFound.tsx" ]

# # Target folder
# folder_name = "pages"

# # Create the folder if it doesn't exist
# os.makedirs(folder_name, exist_ok=True)

# # Create each file
# for file in filenames:
#     file_path = os.path.join(folder_name, file)
#     with open(file_path, 'w') as f:
#         f.write("// " + file)  # You can customize default content here

# print(f"Created {len(filenames)} files in the '{folder_name}' folder.")


# List of filenames to create
filenames = [".gitignore","components.json", "eslint.config.js","index.html","package.json", "postcss.config.js","README.md","tailwind.config.ts","tsconfig.app.json","tsconfig.json","tsconfig.node.json","vite.config.ts" ]

# Target folder
folder_name = "abd"

# Create the folder if it doesn't exist
os.makedirs(folder_name, exist_ok=True)

# Create each file
for file in filenames:
    file_path = os.path.join(folder_name, file)
    with open(file_path, 'w') as f:
        f.write("// " + file)  # You can customize default content here

print(f"Created {len(filenames)} files in the '{folder_name}' folder.")
