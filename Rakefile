desc "Deploy to server"
task :deploy do
  sh "BRANCH=$(git describe --contains --all HEAD) && echo Deploying $BRANCH … && compass compile && rsync -rtz --exclude .git --exclude .sass-cache . pb@haz.io:projects/haz/$BRANCH/"
end
