# Contributing to json-gui

Contributions to json-gui are welcome from all!

json-gui is managed via [git](https://git-scm.com), with the canonical upstream
repository hosted on [GitHub](https://github.com/simoneldevig/json-gui).

json-gui follows a pull-request model for development.  If you wish to
contribute, you will need to create a GitHub account, fork this project, push a
branch with your changes to your project, and then submit a pull request.

Please remember to sign off your commits (e.g., by using `git commit -s` if you
are using the command line client). This amends your git commit message with a line
of the form `Signed-off-by: Name Lastname <name.lastmail@emailaddress.com>`. Please
include all authors of any given commit into the commit message with a
`Signed-off-by` line. This indicates that you have read and signed the Developer
Certificate of Origin (see below) and are able to legally submit your code to
this repository.

See [GitHub's official documentation](https://help.github.com/articles/using-pull-requests/) for more details.

# Branch naming
Please use the following covention for branching: 
- **Feature branches** ➡ feature/[issue-id]-[your-branch-name]
- **Hotfix/bugxfix branches** ➡ hotfix/[issue-id]-[your-branch-name]
- **Docs branches** ➡ docs/[issue-id]-[your-branch-name]

# Issues
Please use the issue templates when creating issues. Issues that haven't used or filled out the template will be closed without further notice.

# Creating pull-requests
Please fill out the pull-request template when creating pull-requests. Pull-requests that haven't used or filled out the template will be closed without further notice.

# Commit convention
When contributing to the project, your commits should use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention since commits is used to automatically generate changelogs.

# Getting Started

``` bash
npm i
npm json-gui (fires up json-server)
npm run dev (fires up vue app - has to be run in seperate terminal window)
```

See [LICENSE](https://github.com/simoneldevig/json-gui/blob/master/LICENSE)
for details about how json-gui is licensed.
