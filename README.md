# Deslider
Deslider is a feature-rich slideshow library that aims for easy use.

## Table of contents
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Getting started](#getting-started)
  - [CDN](#cdn)
  - [Bower/NPM](#bowernpm)
- [Configuration](#configuration)
  - [Example Options](#exmaple-options)

## Live Demo
[Codepen](http://codepen.io/kevlai22/pen/zNmZQv)

## Installation
You may install Deslider using NPM or Bower:
- NPM: `npm install deslider`
- Bower: `bower install deslider`
If you prefer, you can include this library in your project using our officical CDN:
- [Deslider on jsDelivr](https://www.jsdelivr.com/projects/deslider)

## Getting Started
### CDN
Add the necessary links to your `<head>` element: with a unique `id`:

```html
  <script type="text/javascript" src="https://cdn.jsdelivr.net/deslider/1.5.1/Deslider.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/deslider/1.5.1/style.css">
```

### Bower/NPM
```html
  <script type="text/javascript" src="INSTALLATION_DIR/lib/Deslider.min.js"></script>
  <link rel="stylesheet" type="text/css" href="INSTALLATION_DIR/css/style.css">
```
And add a `<div>` with a unique `id`:

```html
  <div id="deslider-container"></div>
```

## Configuration
At the end of your page you need to initialize Deslider by running the following code:

```javascript
  var myDeslider = new Deslider(imgSources, container, options);
```

* `imgSources` (*Array*): contains all the images you want to show in Deslider
* `container` (*String*): the `id` of the container  
* `options` (*Object*, Optional): configuration  
 * `auto` (*Object*): the existence of this object enables Deslider's automatic animation and defines its behaviors  
   * `speed` (*Number*): the number of time(ms) for switching to another image automatically  
   * `pauseOnHover` (*Boolean*): enables/disables the animation when the mouse hovers on Deslider  
 * `fullScreen` (*Boolean*): enables/disables the button that lets user toggle between full-screen mode and normal mode  
 * `swipe` (Boolean): enables/disables the feature that lets swipe the slideshow for another image  
 * `pagination` (*Boolean*): shows/hides the pagination bar  
 * `repeat` (*Boolean*): specifies if looping back to the first image after the last image in imgSources is shown 
   
### Example Usage:
  ```javascript
  var imgSources = [
    "sample.jpg",
    "https://sample_image.com/source.jpg",
    ...
  ];
  
  var containerId = '#deslider-container';
  
  var options = {
    auto: {
      speed: 3000,
      pauseOnHover: true,
    },
    fullScreen: true,
    swipe: true,
    pagination: true,
    repeat: true
  };
  
  var myDeslider = new Deslider(imgSources, containerId, options);
  ```
  
