import mongoose from 'mongoose';
const { Schema } = mongoose;


const ProjectsWorked_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

  projectName: String,
  roleInProject: String,
  responsibilities: String,
  projectSummary: String,
  projectImpact: String,
  projectLinks: [],

    is_del: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date
    }
});


const ProjectsWorked_Schema_Model = mongoose.model('projects_worked', ProjectsWorked_Schema);
export default ProjectsWorked_Schema_Model;
