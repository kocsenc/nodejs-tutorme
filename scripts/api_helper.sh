#!/bin/bash

URI=${URI:='https'}
URL=${URL:=127.0.0.1}
PORT=${PORT:=3000}

BASE=$URI://$URL:$PORT

function register() {
  curl -X POST -k -d "type=$2&name=$3&email=$4&password=$5&postal=$6" $BASE/users/register
}

function login() {
  curl -X POST -k -d "email=$2&password=$3" $BASE/users/login
}

function logout() {
  curl -X POST -k -d "email=$2&token=$3" $BASE/users/logout
}

function send-message() {
  curl -X POST -k -d "email=$2&token=$3&userId=$4&contents=$5" $BASE/messages/send
}

function get-messages() {
  echo -e "curl -X GET -k -d \"email=$2&token=$3\" $BASE/messages"
  curl -X GET -k -d "email=$2&token=$3" $BASE/messages
}

function help() {
  echo -e "Available commands (and usage):";
  echo -e "\t* register:\t type name email password postal";
  echo -e "\t* login:\t email password";
  echo -e "\t* logout:\t email token";
  echo -e "\t* send-message:\t email token userID message";
  echo -e "\t* get-messages:\t email token";
  exit 1
}

case $1 in
  register)
    if [ $# -ne 6 ]
    then
      help
    else
      register $@
    fi
    ;;
  login)
    if [ $# -ne 3 ]
    then
      help
    else
      login $@
    fi
    ;;
  logout)
    if [ $# -ne 3 ]
    then
      help
    else
      logout $@
    fi
    ;;
  send-message)
    if [ $# -ne 5 ]
    then
      help
    else
      send-message $@
    fi
    ;;
  get-messages)
    if [ $# -ne 3 ]
    then
      help
    else
      get-messages $@
    fi
    ;;
  *)
    help
    ;;
esac

echo ""

