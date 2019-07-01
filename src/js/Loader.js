function Loader(container, loaderHTML){
    this.container = container;
    this.loaderHTML = loaderHTML;
    this._containerHTML = '';
}

Loader.prototype.on = function(){
    this._containerHTML = this.container.innerHTML;

    this.container.style.height = this.container.getBoundingClientRect().height + 'px';
    this.container.innerHTML = this.loaderHTML;


};

Loader.prototype.off = function(){
    this.container.innerHTML = this._containerHTML;

    this._containerHTML = '';
};

export default Loader;