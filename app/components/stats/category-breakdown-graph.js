import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { select } from 'd3-selection';
import { arc, pie } from 'd3-shape';

const COLORS = ['#FEB700', '#FF9300', '#FF3281', '#BC6EDA', '#00BBED', '#545C97', '#EA6200'];

export default Component.extend({
  stat: null,
  kind: 'Media',
  size: 150,

  classNames: ['category-breakdown-graph'],

  genreCounts: alias('stat.categories'),
  mediaCount: alias('stat.total'),

  didReceiveAttrs() {
    scheduleOnce('render', this, this.draw);
  },

  displayGenres: computed('stat.categories', function () {
    // Get the data, conver it to an object of {name, number}
    const data = get(this, 'stat.categories');
    const arrayData = Object.keys(data).map(key => ({ name: key, number: data[key] }));
    // Sort the data from biggest to smallest and take the top 7
    const sorted = arrayData.sort(({ number: a }, { number: b }) => a < b).slice(0, 7);
    // Add the colors
    return sorted.map((datum, i) => ({
      ...datum,
      relativeSize: (datum.number / sorted[0].number * 100),
      color: COLORS[i % COLORS.length]
    }));
  }),

  draw() {
    const data = get(this, 'displayGenres');
    const size = get(this, 'size');
    const radius = size / 2;

    // The donut chart
    const outerArc = arc().outerRadius(radius).innerRadius(radius - 25);

    const chart = pie().sort(null).value(({ number }) => number);

    const svg = select(this.element).select('.graph-canvas')
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`);

    const g = svg.selectAll('.arc')
      .data(chart(data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', outerArc)
      .style('fill', ({ data: { color } }) => color);
  }
});
