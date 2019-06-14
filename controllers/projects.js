const Projects = require('../models/projects'),
    Tags = require('../models/tags'),
    Users = require('../models/usersModel');

exports.projects_list_get = async (req, res) => {
    const projectsList = await Projects.getAllProjects();
    const cohortsList = await Projects.getCohorts();
    const tagsList = await Tags.getAllTags();
    res.render('template', {
        locals: {
            title: 'Projects List',
            is_logged_in: req.session.is_logged_in,
            allProjects: projectsList,
            allCohorts: cohortsList,
            allTags: tagsList
        },
        partials: {
            partial: 'partial-projects'
        }
    });
}

exports.my_projects_get = async (req, res) => {
    const email = req.session.email;
    const myProjects = await Projects.getMyProjects(email);
    res.render('template', {
        locals: {
            title: 'Your Projects',
            is_logged_in: req.session.is_logged_in,
            myProjectsList: myProjects
        },
        partials: {
            partial: 'partial-my-projects'
        }
    });
}

exports.edit_project_get = async (req, res) => {
    if(req.session.is_logged_in == true) {
        const projectUsers = await Projects.getProjectUsers(req.params.project_id);
        const email = req.session.email;
        const userId = Projects.checkUser(email);
        let authorized = false;
        projectUsers.forEach(() => {
            if(user_id = userId) {
                authorized = true;
                return authorized;
            }
        });
        if(authorized == true) {
            const projectData = await Projects.getProjectData(req.params.project_id);
            res.render('template', {
                locals: {
                    title: 'Edit Project',
                    is_logged_in: req.session.is_logged_in,
                    oneProject: projectData
                },
                partials: {
                    partial: 'partial-edit-project'
                }
            });
        } else {
            res.redirect('/');
        }
    }
    else {
        res.redirect('/');
    }
}

exports.edit_project_post = async (req, res) => {
    const id = req.params.project_id,
        name = req.body.name,
        description = req.body.description,
        github = req.body.github_repo,
        url = req.body.url;
    await Projects.editProject(id, name, description, github, url);
    res.redirect('/projects/myprojects');
}

exports.projects_list_get_by_cohort = async (req, res) => {
    const projectsList = await Projects.getProjectsByCohort(req.body.cohort_id)
    const cohortsList = await Projects.getCohorts();
    const tagsList = await Tags.getAllTags();
    res.render('template', {
        locals: {
            title: 'Projects List',
            is_logged_in: req.session.is_logged_in,
            allProjects: projectsList,
            allCohorts: cohortsList,
            allTags: tagsList
        },
        partials: {
            partial: 'partial-projects'
        }
    });
}

exports.project_data_get = async (req,res) => {
    const projectData = await Projects.getProjectData(req.params.project_id);
    res.render('template', {
        locals: {
            title: 'Projects Data',
            is_logged_in: req.session.is_logged_in,
            oneProject: projectData
        },
        partials: {
            partial: 'partial-one-project'
        }
    });
}

exports.project_post = async (req, res) => {
    const name = req.body.name,
        description = req.body.description,
        github_repo = req.body.github_repo,
        cohort_id = req.body.cohort_id,
        url = req.body.url,
        tags = req.body.tags,
        user_1 = req.body.user_1,
        user_2 = req.body.user_2,
        user_3 = req.body.user_3;
    let response = await Projects.addProject(name, description, github_repo, cohort_id, url)
    await Tags.addTags(tags, response.project_id)
    await Projects.addProjectUser(response.project_id, user_1)
    await Projects.addProjectUser(response.project_id, user_2)
    await Projects.addProjectUser(response.project_id, user_3)
    res.redirect('/projects');
}

exports.add_project_page = async (req, res) => {
    const cohortsList = await Projects.getCohorts();
    const userList = await Users.getAllUsers();
    res.render('template', {
        locals: {
            title: 'Submit a Project',
            is_logged_in: req.session.is_logged_in,
            allCohorts: cohortsList,
            allUsers: userList
        },
        partials: {
            partial: 'partial-add-project'
        }
    })
}