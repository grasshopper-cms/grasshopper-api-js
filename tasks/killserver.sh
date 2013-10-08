#!/bin/bash
#
#  Simple script to kill and/or restart a node server
#  By Brian Moeskau
#
#    Basic usage: sh kill.sh [-r] server-name
#

set -o errexit

# Message to display when invalid args are passed
function usage {
	echo
	echo "usage: sh kill.sh [-r] server-name"
	echo
	echo "   -r: Automatically restart the server"
	echo
}

# Parse the command line args
while getopts ":r" opt; do
	case $opt in
		r)
			restart=1
			shift
			;;
		\?)
			usage
			exit 1
	esac
done

# After shifting any flags above, the server name should be the only remaining arg now:
SERVER=$1

# If no server specified exit early
if [ "$SERVER" = "" ]; then
	echo
	echo You must specify the filename of the server to kill
	usage
	exit 1
fi

# Grab the list of any existing node process ids running with the specified server name
PID=$(ps ax | grep "[n]ode $SERVER" | awk '{print $1}')

# Kill existing processes if any
if [ "$PID" = "" ]; then
	echo $SERVER is not currently running
else
	echo Killing $SERVER...
	sudo kill -KILL $PID
fi

# Just exit on Ctrl-C, skip the error message output below
trap "exit" SIGINT SIGQUIT SIGTERM

# If the restart flag was passed in try to kick off a new instance of the server
if [ "$restart" = "1" ]; then
	echo Starting $SERVER "(use Ctrl-C to exit)..."
	sudo node $SERVER || {
		# If we're here then some error occurred trying to start the server.
		# The error message will get displayed in the terminal.
		echo
		echo "Could not start \"$SERVER\" -- please make sure the name and path are correct"
		exit 1
	}
fi