const category = require('../models/Category');

const CategoryServices = {

    CreateCategory: async (data) => {
        try {
            const Category = await category.create(data);
            return Category;
        }
        catch (error) {
            throw new Error(`Error creating Category: ${error.message}`);
        }


    },
}
module.exports = CategoryServices;