# Dockerfile para aplicação frontend
FROM node:20

WORKDIR /app

# Copie apenas package.json e package-lock.json
COPY package*.json ./

# Instale dependências
RUN npm install

# Copie todo o projeto
COPY . .

# Exponha a porta usada pelo React (npm run dev)
EXPOSE 5173

# Comando para iniciar a aplicação React e Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
