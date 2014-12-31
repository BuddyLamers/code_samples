// https://github.com/BuddyLamers/MoonDrakeStudio
// This is a gallery view I made for a client. 
// It uses AJAX to fetch photos using the Instagram API, and paginate them.
// Because the Instagram API has a max query of 20, I decided to query on each gallyer
// rather than utilize the backbone collections, to speed up initial page load.

MoonDrake.Views.Gallery = Backbone.View.extend({

  initialize: function(){
    var tag = this.model;
    this.previousPages = [];
    this.currentPage = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=" + "ca710f787fa246c3b08792d5b91e970e";
    this.nextPage = null;
  },

  template: JST['pictures/gallery'],

  events: {
    'click .next': '_next',
    'click .previous': '_previous'
  },

  oldrender: function(){
    var renderedContent = this.template({});
    this.$el.html(renderedContent);
    return this;
  },

  render: function(){
    var photoCount = 9;
    var that = this;
    
   
    this._fetchPhotos(this.currentPage);

    return this;
  },

  _fetchPhotos: function(passedUrl){
    var photoCount = 8;
    var that = this;

    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: passedUrl ,
      success: function(response) {
        var length = response.data != 'undefined' ? response.data.length : 0;
        var limit = photoCount != null && photoCount < length ? photoCount : length;
        if(limit > 0) {
          for(var i = 0; i < limit; i++) {
           that.$el.append($('<img>', {
            class: "instagram-photo",
            src: response.data[i].images.standard_resolution.url
          }));
         }
       }

       console.log(response.pagination);
       that.nextPage = response.pagination.next_url;
       console.log(that.nextPage);
       that.$el.append(that.template({
        number: that.previousPages.length
       }));
     }
   });
  },

  _next: function(){
    console.log(this.nextPage);
    if (this.nextPage === undefined) {
      return;
    };
    this.$el.empty();
    this.previousPages.push(this.currentPage);
    this.currentPage = this.nextPage;
    this._fetchPhotos(this.nextPage);
  },

  _previous: function(){
    if (this.previousPages.length < 1) {
      return;
    };
    this.$el.empty();
    this.nextPage = this.currentPage;
    this.currentPage = this.previousPages.pop();
    this._fetchPhotos(this.currentPage);
  }

});