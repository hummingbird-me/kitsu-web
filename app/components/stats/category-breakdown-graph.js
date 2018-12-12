import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { select } from 'd3-selection';
import { arc, pie } from 'd3-shape';

const COLORS = ['#FEB700', '#FF9300', '#FF3281', '#BC6EDA', '#00BBED', '#545C97', '#EA6200'];

export default Component.extend({
  stat: null,
  size: 140,

  classNames: ['category-breakdown-graph'],

  didReceiveAttrs() {
    scheduleOnce('render', this, this.draw);
  },

  displayGenres: computed('stat.categories', function () {
    // Get the data, conver it to an object of {name, number}
    const data = get(this, 'stat.categories');
    const total = get(this, 'stat.total');
    const arrayData = Object.keys(data).map(key => ({
      name: key, percent: data[key] / total * 100
    }));
    // Sort the data from biggest to smallest and take the top 6
    const sorted = arrayData.sort(({ percent: a }, { percent: b }) => b - a).slice(0, 6);
    // Remove smaller than 1% categories
    const filtered = sorted.filter(({ percent }) => Math.round(percent) > 0);
    // Sum up percentages to calculate other
    const shownPercent = filtered.reduce((acc, { percent }) => acc + percent, 0);
    const all = [...filtered, {
      name: 'Other', percent: 100 - shownPercent
    }];
    // Add the colors
    return all.map((datum, i) => ({
      ...datum,
      relativeSize: (datum.percent / all[0].percent * 100),
      color: COLORS[i % COLORS.length]
    }));
  }),

  draw() {
    const data = get(this, 'displayGenres');
    const size = get(this, 'size');
    const radius = size / 2;

    // The donut chart
    const outerArc = arc().outerRadius(radius).innerRadius(radius - 20);

    const chart = pie().sort(null).value(({ percent }) => percent);

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
