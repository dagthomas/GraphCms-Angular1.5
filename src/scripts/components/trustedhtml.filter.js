export default class TrustFilter {
  constructor(input, $sce) {
    this.input = input;
    this.$sce = $sce;
  }

  filterInput() {
    let input = this.input;
    return this.$sce.trustAsHtml(input);
  }

  static TrustFilterFactory(input) {
    let filter = new TrustFilter(input);
    return filter.filterInput();
  }
}

TrustFilter.TrustFilterFactory.$inject = ['input', '$sce'];


