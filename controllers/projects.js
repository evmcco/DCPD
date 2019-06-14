const Projects = require('../models/projects');
    Tags = require('../models/tags')

exports.projects_list_get = async (req, res) => {
    const projectsList = await Projects.getAllProjects();
    const cohortsList = await Projects.getCohorts();
    const tagsList = await Tags.getAllTags();
    const projectTagsList = await Tags.getProjectsWithTags();
    let projectsListWithTags = addTagsToProjects(projectsList, projectTagsList)
    console.log("projectsListWithTags:", projectsListWithTags);
    res.render('template', {
        locals: {
            title: 'Projects List',
            is_logged_in: req.session.is_logged_in,
            allProjects: projectsListWithTags,
            allCohorts: cohortsList,
            allTags: tagsList
        },
        partials: {
            partial: 'partial-projects'
        }
    });
}

function addTagsToProjects(projectsList, tagsList) {
    for (project in projectsList) {
        for (tags in tagsList) {
            if (projectsList[project].project_id == tagsList[tags].project_id) {
                projectsList[project].tags_list = tagsList[tags].tags_list
            }
        }
    }
    return projectsList
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

exports.projects_list_get_by_cohort_and_tag = async (req, res) => {
    const projectsList = await Projects.getProjectsByCohort(req.body.cohort_id)
    const cohortsList = await Projects.getCohorts();
    const tagsList = await Tags.getAllTags();
    const projectTagsList = await Tags.getProjectsWithTags();
    let projectsListWithTags = addTagsToProjects(projectsList, projectTagsList)
    console.log(projectsListWithTags);
    const projectsListFilteredByTag = projectsListWithTags.filter(project => !!project.tags_list)
                                                        .filter(project => project.tags_list.includes(req.body.tag))
    console.log(projectsListFilteredByTag)
    res.render('template', {
        locals: {
            title: 'Projects List',
            is_logged_in: req.session.is_logged_in,
            allProjects: projectsListFilteredByTag,
            allCohorts: cohortsList,
            allTags: tagsList,
        },
        partials: {
            partial: 'partial-projects'
        }
    });
}

exports.project_data_get = async (req,res) => {
    const projectData = await Projects.getProjectData(req.params.project_id);
    const projectTags = await Tags.getSingleProjectTags(req.params.project_id)
    res.render('template', {
        locals: {
            title: 'Projects Data',
            is_logged_in: req.session.is_logged_in,
            oneProject: projectData,
            tagsList: projectTags
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
        tags = req.body.tags;
    let response = await Projects.addProject(name, description, github_repo, cohort_id, url)
    await Tags.addTags(tags, response.project_id)
    res.redirect('/projects');
}

exports.add_project_page = async (req, res) => {
    const cohortsList = await Projects.getCohorts();
    res.render('template', {
        locals: {
            title: 'Submit a Project',
            is_logged_in: req.session.is_logged_in,
            allCohorts: cohortsList
        },
        partials: {
            partial: 'partial-add-project'
        }
    })
}

exports.filter_by_tag = (data) => {
    allTags = document.querySelectorAll(".tag");
    allTags.forEach(tag => {
        tag.addEventListener('click', () => {
            console.log(`filtering on ${tag.innerHTML}`)
            return data.filter(project.tags_list.contains(tag.innerHTML))
        })
    })
}

// allTags = document.getElementsByClass("tag is-primary");
// allTags.forEach(tag => {
//     tag.addEventListener('click', () => {
//         console.log(`filtering on ${tag.innerHTML}`)
//         data.filter(project.tags.contains(tag.innerHTML))
//         return data
//     })
// })
