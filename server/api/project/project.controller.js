'use strict';

var _ = require('lodash');
var Project = require('./project.model');
var User = require('../user/user.model');
//var UserC = require('../user/user.controller');

// Get list of projects
exports.index = function(req, res) {
  Project.find(function (err, projects) {
    if(err) { return handleError(res, err); }
    return res.json(200, projects);
  });
};

// Get a single project
exports.show = function(req, res) {
/*  Project.findById(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    return res.json(project);
  });*/
  Project.findOne({name: req.params.id}, function (err, project) {
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    return res.json(project);
  });
};

// Creates a new project in the DB.
exports.create = function(req, res) {
  console.log(req.body);
  Project.create(req.body, function(err, project) {
    if(err) { console.log(err); return handleError(res, err); }
    return res.json(201, project);
  });
};

// Updates an existing project in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    var updated = _.merge(project, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, project);
    });
  });
};

// Deletes a project from the DB.
exports.destroy = function(req, res) {
  Project.findById(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    project.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}


exports.contribute = function(req, res) 
{
  console.log("I CONTRIBUTE :!!!!!");
  var toContrib = Number(req.body.amount);
  var nameProj = req.params.name.replace("%20", " ");
  console.log(req.body.userId);
  console.log(toContrib);
  User.findById(req.body.userId, function (err, user)
  {
    if (err)
      return handleError(res, err);
    if (!user)
    {
      return handleError(res, err);
    }
    if (toContrib <= user.balance)
    {
      user.balance -= toContrib;
      user.save(function (err)
        {
          if (err)
            return handleError(res, err);
          Project.findOne({name: nameProj}, function (err, project)
          {
            if (err)
              return handleError(res, err);
            if (!project)
              return handleError(res, err);
            project.amountRaised += toContrib;
            console.log(user);
            project.contributors.push({contribId: user._id, amount: toContrib});
            project.save(function (err)
              {
                if (err)
                  return handleError(res, err);
                return res.json(200, project);
              });
          });
        });
    }
    else
    {
      return handleError(res, 'Amout > Balance');
    }
  });

}