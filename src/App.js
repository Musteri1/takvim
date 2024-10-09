import React from 'react';
import moment from 'moment';

import Calendar from './Calendar';
import CalendarControls from './CalendarControls';
import './style.css';



class App extends React.Component {
  constructor(props) {
    super(props);

    const today = moment();

    const customCSSclasses = {
      holidays: ['2024-04-25', '2024-05-01', '2024-06-02', '2024-08-15', '2024-11-01'],
      spring: {
        start: '2024-03-21',
        end: '2024-6-20'
      },
      summer: {
        start: '2024-06-21',
        end: '2024-09-22'
      },
      autumn: {
        start: '2024-09-23',
        end: '2024-12-21'
      },
      weekend: 'Sat,Sun',
      winter: day => day.isBefore(moment([2024, 2, 21])) || day.isAfter(moment([2024, 11, 21]))
    };
    // alternatively, customClasses can be a function accepting a moment object. For example:
    // day => (day.isBefore(moment([day.year(),2,21])) || day.isAfter(moment([day.year(),11,21]))) ? 'winter': 'summer'

    this.state = {
      year: today.year(),
      selectedDay: today,
      selectedRange: [today, moment(today).add(7, 'day')],
      showDaysOfWeek: true,
      showTodayBtn: true,
      showWeekSeparators: true,
      selectRange: false,
      firstDayOfWeek: 0, // sunday
      customCSSclasses
    };
  }

  onPrevYear() {
    this.setState(prevState => ({
      year: prevState.year - 1
    }));
  }

  onNextYear() {
    this.setState(prevState => ({
      year: prevState.year + 1
    }));
  }

  goToToday() {
    const today = moment();

    this.setState({
      selectedDay: today,
      selectedRange: [today, moment(today).add(7, 'day')],
      year: today.year()
    });
  }

  datePicked(date) {
    this.setState({
      selectedDay: date,
      selectedRange: [date, moment(date).add(7, 'day')]
    });
  }

  rangePicked(start, end) {
    this.setState({
      selectedRange: [start, end],
      selectedDay: start
    });
  }

  toggleShowDaysOfWeek() {
    this.setState(prevState => ({
      showDaysOfWeek: !prevState.showDaysOfWeek
    }));
  }

  toggleForceFullWeeks() {
    this.setState(prevState => ({
      showDaysOfWeek: true,
      forceFullWeeks: !prevState.forceFullWeeks
    }));
  }

  toggleShowTodayBtn() {
    this.setState(prevState => ({
      showTodayBtn: !prevState.showTodayBtn
    }));
  }

  toggleShowWeekSeparators() {
    this.setState(prevState => ({
      showWeekSeparators: !prevState.showWeekSeparators
    }));
  }

  toggleSelectRange() {
    this.setState(prevState => ({
      selectRange: !prevState.selectRange
    }));
  }

  selectFirstDayOfWeek(event) {
    this.setState({
      firstDayOfWeek: parseInt(event.target.value, 10)
    });
  }

  render() {
    const {
      year,
      showTodayBtn,
      selectedDay,
      showDaysOfWeek,
      forceFullWeeks,
      showWeekSeparators,
      firstDayOfWeek,
      selectRange,
      selectedRange,
      customCSSclasses
    } = this.state;

    return (
      <div>
        <div id="calendar">
          <CalendarControls
            year={year}
            showTodayButton={showTodayBtn}
            onPrevYear={() => this.onPrevYear()}
            onNextYear={() => this.onNextYear()}
            goToToday={() => this.goToToday()}
          />
          <Calendar
            year={year}
            selectedDay={selectedDay}
            showDaysOfWeek={showDaysOfWeek}
            forceFullWeeks={forceFullWeeks}
            showWeekSeparators={showWeekSeparators}
            firstDayOfWeek={firstDayOfWeek}
            selectRange={selectRange}
            selectedRange={selectedRange}
            onPickDate={(date, classes) => this.datePicked(date, classes)}
            onPickRange={(start, end) => this.rangePicked(start, end)}
            customClasses={customCSSclasses}
          />
        </div>

      

        <div className="options">
          <b>Demo Options</b>
          <br />
          <ul>
            <li>
              <label htmlFor="firstDayOfWeek">First day of week</label>
              <select id="firstDayOfWeek" value={firstDayOfWeek} onChange={e => this.selectFirstDayOfWeek(e)}>
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <option key={i} value={i}>
                    {moment()
                      .weekday(i)
                      .format('ddd')}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <input id="selectRange" type="checkbox" checked={selectRange} onChange={() => this.toggleSelectRange()} />
              <label htmlFor="selectRange">Select Date range</label>
            </li>
          </ul>
         
        
        </div>
      </div>
    );
  }
}

export default App;