module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      "my_target": {
        "files": {
          'dest/waterdrop.min.js': ['src/waterdrop.js', 'src/jquery.datetimepicker.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // 默认任务
  grunt.registerTask('default', ['uglify']);
}