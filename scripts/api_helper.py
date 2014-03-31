#!/usr/bin/env python

import sys
import argparse
import urllib.request
import json

def executeAction(area, args, data, id=None):
  if id:
    url = "{}{}:{}/{}/{}/{}".format(args.uri, args.host, args.port, area, args.action, id)
  else:
    url = "{}{}:{}/{}/{}".format(args.uri, args.host, args.port, area, args.action)

  jsonData = json.dumps(data)
  postData = jsonData.encode('utf-8')

  headers = {}
  headers['Content-Type'] = 'application/json'

  req = urllib.request.Request(url, postData, headers)
  
  try:
    res = urllib.request.urlopen(req)
    print(res.read().decode('utf-8'))
  except urllib.error.HTTPError as err:
    print("Error: {}".format(err))
    sys.exit(1)

def registerAction(args):
  data = {
    'type': getTypeCode(args.type),
    'name': args.name,
    'email': args.email,
    'password': args.password,
    'postal': args.postal
  }

  executeAction('users', args, data)

def loginAction(args):
  data = {
    'email': args.email,
    'password': args.password
  }

  executeAction('users', args, data)

def logoutAction(args):
  data = {
    'email': args.email,
    'token': args.token
  }

  executeAction('users', args, data)

def voteAction(args):
  data = {
    'email': args.email,
    'token': args.token
  }

  executeAction('profiles', args, data, args.user)

def getTypeCode(arg):
  if arg == 'student':
    return 0
  elif arg == 'tutor':
    return 1

def parseArguments():
  parser = argparse.ArgumentParser(description='TutorMe backend API helper.')
  subparsers = parser.add_subparsers(metavar='action', help='Choose an API call to make.', dest='action') 
  
  addRegisterCommands(subparsers)
  addLoginCommands(subparsers)
  addLogoutCommands(subparsers)
  addVoteCommands(subparsers)
   
  parser.add_argument('--ssl', action='store_true', help='Turns on SSL support. (Default: off)')
  parser.add_argument('--host', default='127.0.0.1', help='Host of the application. (Default: 127.0.0.1)')
  parser.add_argument('--port', default='3000', help='Port to connect to. (Default: 3000)', type=int)
  
  args = parser.parse_args()
  
  if not args.action:
    parser.print_help()
    sys.exit(1)

  if args.ssl:
    args.uri = "https://"
  else:
    args.uri = "http://"

  return args

def addRegisterCommands(subparsers):
  registerParser = subparsers.add_parser('register', help='Register for the TutorMe service.')
  registerParser.add_argument('type', choices=['student', 'tutor'], help='Type of the new user.')
  registerParser.add_argument('name', action='store', help='Name of the new user.')
  registerParser.add_argument('email', action='store', help='Email of the new user.')
  registerParser.add_argument('password', action='store', help='Password of the new user.')
  registerParser.add_argument('postal', action='store', help='Postal code of the new user.')

def addLoginCommands(subparsers):
  loginParser = subparsers.add_parser('login', help='Login to the TutorMe service.')
  loginParser.add_argument('email', action='store', help='Email of the user.')
  loginParser.add_argument('password', action='store', help='Password of the user.')

def addLogoutCommands(subparsers):
  logoutParser = subparsers.add_parser('logout', help='Logout of the TutorMe service.')
  logoutParser.add_argument('email', action='store', help='Email of the logged in user.')
  logoutParser.add_argument('token', action='store', help='Token of the logged in user.')

def addVoteCommands(subparsers):
  voteParser = subparsers.add_parser('vote', help='Vote for a user\'s TutorMe profile.')
  voteParser.add_argument('email', action='store', help='Email of the logged in user.')
  voteParser.add_argument('token', action='store', help='Token of the logged in user.')
  voteParser.add_argument('user', action='store', help='Email of the user for which to cast a vote.')

actionMapper = {
  'register': registerAction,
  'login': loginAction,
  'logout': logoutAction,
  'vote': voteAction
}

def main():
  args = parseArguments()
  actionMapper[args.action](args)
  sys.exit(0)

if __name__ == '__main__':
  main()

