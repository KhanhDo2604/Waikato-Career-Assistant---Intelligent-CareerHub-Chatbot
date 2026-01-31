#!/bin/bash

echo "### 1. update system ###"
#update server
sudo apt upgrade && sudo apt upgrade -y

echo "### 2. install Ollama 和model ###"
#Install Ollama and models
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3
ollama pull nomic-embed-text

echo "### 3. install Docker Engine ###"
#Install Docker
#Uninstall all conficts packages
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)

# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

# install latest docker
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "### 4.  install Milvus Standalone (v2.6.6) ###"
#Install Milvus
#Download the configuration file
wget https://github.com/milvus-io/milvus/releases/download/v2.6.6/milvus-standalone-docker-compose.yml -O docker-compose.yml

#Start Milvus
sudo docker compose up -d

#download nginx and config nginx
sudo apt install -y nginx


sudo aws s3 cp s3://596ai-server-bucket/nginx.conf /etc/nginx/sites-available/

sudo dos2unix /etc/nginx/sites-available/nginx.conf
sudo ln -sf /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/nginx.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

#install miniconda and initial python environment
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
bash ~/miniconda.sh -b -p $HOME/miniconda3
$HOME/miniconda3/bin/conda init --all
source ~/.bashrc
conda create -n 596ai_server python=3.13.2 -y
conda activate 596ai-server
