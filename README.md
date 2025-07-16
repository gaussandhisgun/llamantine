![Llamantine logo](src/favicon.png)

# Llamantine
A web based [ollama](https://github.com/ollama/ollama) frontend

## THIS SHIT IS EXPERIMENTAL AND UNSAFE AND SHOULD ONLY BE USED LOCALLY

### Thanks to:

- ollama for existing as a self hosted solution for large language model shenanigans
- Showdown, a markdown to html converter
- Arch Linux Community for inspiration, emotional support and ideas

### How to install:

1. get [ollama](https://github.com/ollama/ollama) up and running somewhere
2. install some models using the ollama CLI
3. serve llamantine as a static website (be it through `python3 -m http.server`, apache, nginx or whatever)
4. launch it, the first launch will ask you for your ollama instance ip

all of your chats are stored locally directly in your browser
