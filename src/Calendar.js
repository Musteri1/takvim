import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { momentObj } from 'react-moment-proptypes';
import Month from './Month';


export function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  step = step || 1;

  const length = Math.max(Math.ceil((stop - start) / step), 0);
  const range = Array(length);

  for (let idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

const propTypes = {
  year: PropTypes.number.isRequired,
  forceFullWeeks: PropTypes.bool,
  showDaysOfWeek: PropTypes.bool,
  showWeekSeparators: PropTypes.bool,
  firstDayOfWeek: PropTypes.number,
  useIsoWeekday: PropTypes.bool,
  selectRange: PropTypes.bool,
  onPickDate: PropTypes.func,
  onPickRange: PropTypes.func,
  selectedDay: momentObj,
  customClasses: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  titles: PropTypes.func
};

const defaultProps = {
  forceFullWeeks: false,
  showDaysOfWeek: true,
  showWeekSeparators: true,
  firstDayOfWeek: 0,
  useIsoWeekday: false,
  selectRange: false,
  onPickDate: null,
  onPickRange: null,
  selectedDay: moment(),
  customClasses: null,
  titles: null
};

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectingRange: undefined
    };
  }

  dayClicked(date, classes) {
    if (!date) {
      // clicked on prev or next month
      return;
    }

    let { selectingRange } = this.state;
    const { selectRange, onPickRange, onPickDate } = this.props;

    if (!selectRange) {
      if (onPickDate instanceof Function) {
        onPickDate(date, classes);
      }
      return;
    }

    if (!selectingRange) {
      selectingRange = [date, date];
    } else {
      if (onPickRange instanceof Function) {
        if (selectingRange[0] > date) {
          onPickRange(date, selectingRange[0]);
        } else {
          onPickRange(selectingRange[0], date);
        }
      }
      selectingRange = undefined;
    }

    this.setState({
      selectingRange
    });
  }

  dayHovered(hoveredDay) {
    if (!hoveredDay) {
      // clicked on prev or next month
      return;
    }

    const { selectingRange } = this.state;

    if (selectingRange) {
      selectingRange[1] = hoveredDay;

      this.setState({
        selectingRange
      });
    }
  }

  renderDaysOfWeek() {
    const { useIsoWeekday, firstDayOfWeek, forceFullWeeks, showWeekSeparators } = this.props;
    const totalDays = forceFullWeeks ? 42 : 37;

    const days = [];
    range(firstDayOfWeek, totalDays + firstDayOfWeek).forEach(i => {
      const momentDay = useIsoWeekday ? moment().isoWeekday(i) : moment().weekday(i);
      const day = momentDay.format('ddd').charAt(0);

      if (showWeekSeparators) {
        if (i % 7 === firstDayOfWeek && days.length) {
          // push week separator
          days.push(<th className="week-separator" key={`seperator-${i}`} />);
        }
      }
      days.push(
        <th key={`weekday-${i}`} className={i % 7 === 0 ? 'bolder' : ''}>
          {day}
        </th>
      );
    });

    return (
      <tr>
        <th>&nbsp;</th>
        {days}
      </tr>
    );
  }

  render() {
    const { selectingRange } = this.state;

    const months = range(3, 10).map(month => (
      <Month
        month={month}
        key={`month-${month}`}
        dayClicked={(d, classes) => this.dayClicked(d, classes)}
        dayHovered={d => this.dayHovered(d)}
        {...this.props}
        selectingRange={selectingRange}
      />
    ));

    return (
      <table className="calendar">
        <thead className="day-headers">{this.props.showDaysOfWeek ? this.renderDaysOfWeek() : null}</thead>
        <tbody>{months}</tbody>
      </table>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

export default Calendar;
