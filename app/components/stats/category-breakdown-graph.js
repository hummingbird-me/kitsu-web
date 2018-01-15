import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { arc, pie } from 'd3-shape';

const COLORS = ['#53c79f', '#7a6fca', '#ca6f96', '#e58c72', '#e8e8e9'];

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
    // Sort the data from biggest to smallest
    const sorted = arrayData.sort(({ number: a }, { number: b }) => a < b);
    // Split it into a 4-item head and a summarized tail
    const primaryData = sorted.slice(0, 4);
    const otherSum = sorted.slice(4).reduce((sum, { number }) => sum + number, 0);
    // Rebuild the list with the summarized entry
    const outputData = [...primaryData, { name: 'Other', number: otherSum }];
    // Add the colors
    const color = scaleOrdinal().range(COLORS);
    return outputData.map(datum => ({ ...datum, color: color(datum.number) }));
  }),

  draw() {
    const data = get(this, 'displayGenres');
    const size = get(this, 'size');
    const radius = size / 2;

    // The donut chart
    const outerArc = arc().outerRadius(radius).innerRadius(radius - 25);
    // The inner shadow
    const innerArc = arc().outerRadius(radius - 20).innerRadius(radius - 25);

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

    g.append('path')
      .attr('d', innerArc)
      .style('fill', 'rgba(0, 0, 0, 0.1)');
  }
});
