# Cassim

Cassim is an easy CLI tool to create nginx vhosts pointing to a certain port.

I created this package to quickly open up ports while developing on a remote server on the go. For example, when I'm working on a `create-react-app` project, I can quickly debug it by typing `cassim add 3000` which will create a subdomain at `3000.mydomain.com`.

Cassim is also Ali Baba's brother. He couldn't open shit and was murdered by the thieves.

# Usage

This package is still very crude and I've only tested it on my own Ubuntu server. You'll need a configured server with nginx running and you'll also need `certbot` if you need SSL.

Install cassim globally by running: `npm i -g cassim` or just invoke it with `npx cassim`

# Setup

The first time you run cassim you'll be asked some questions about where your nginx configuration files are, and which domain you want to use. To be able to resolve the domain you'll configure your DNS-server with a wildcard domain pointing to your server's IP-address. For mydomain.com this would be: \*.mydomain.com.

# Running

If everything is configured properly, you should be able to run `cassim add 3000` and a vhost will be created. If you've enabled SSL and installed `certbot` will be invoked, configuring SSL.

# Todo

- [ ] Implement `cassim remove`
- [ ] Password protection
- [ ] Better error handling
