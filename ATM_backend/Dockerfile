# Use an official Python runtime as a parent image
FROM --platform=linux/amd64 ubuntu:18.04

# Update the system and install only essential packages
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    netbase \
    git \
    make \
    python3.6 \
    python3.6-dev \
    python3-pip

# Pip and python linking
RUN ln -s /usr/bin/pip3 /usr/bin/pip
RUN ln -s /usr/bin/python3 /usr/bin/python
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# Clone the ATM repository from GitHub
WORKDIR /app/ATM
RUN git clone https://github.com/rushabhj16/ATM.git .

RUN git checkout cse-578-data-visualization-project
RUN make install

WORKDIR /app
ADD . .

RUN chmod +x ./entrypoint.sh
CMD ["/app/entrypoint.sh"]
