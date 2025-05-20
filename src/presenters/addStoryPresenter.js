// src/presenters/addStoryPresenter.js
export default class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;  // Model is responsible for handling data
    this.view = view;    // View is responsible for displaying data
  }

  // Presenter calls Model to add the story and update the View
  async addStory(token, description, photo) {
    try {
      this.view.showLoading();  // Show loading during the process
      const response = await this.model.addStory(token, description, photo);  // Call Model to add story

      if (response.error) {
        this.view.renderFailedMessage();  // Show error message if something goes wrong
      } else {
        this.view.renderStorySuccess();  // Show success message if the story is added successfully
      }
    } catch (error) {
      this.view.renderFailedMessage();  // Handle errors and show failure message
    }
  }
}
