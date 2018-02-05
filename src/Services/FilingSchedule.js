export function getTemplates(allTemplates, ID) {
		let t = allTemplates.filter((r => (r.FilingSchedule === ID)))
			.sort((a, b) => (parseInt(a.Filing_Order, 10) < parseInt(b.Filing_Order, 10) ? -1 : 1));
		let tracks = [], sorted = [];
		t.forEach((item) => {
			if(tracks.indexOf(item['Filing_Track']) < 0) {
				tracks.push(item['Filing_Track']);
			}
		});
		tracks.forEach((track) => {
			sorted.push({periods: t.filter(r => r['Filing_Track'] === track)});
		});
		if(!sorted.length) {
			sorted.push({periods:[{}]});
		}
		return sorted;
	}

export function calculateDate(templateDate, reports, scheduleBegin) {
	//do we have a template date?
	if(templateDate && templateDate !== null && templateDate !== undefined && templateDate !== "") {
		try {
			templateDate = JSON.parse(templateDate);
		} catch ( ex ) {
			templateDate = {};
		}
		
		let dateType = "";
		Object.keys(templateDate).forEach((key) => {
			dateType += key;
		});
		let lastDate = reports.length > 0 ? reports[0].End : scheduleBegin;
		lastDate = toDate(lastDate);
		switch(dateType) {
		case "MonthDay":
			let year = lastDate.getFullYear();
			let lastMonth = lastDate.getMonth() + 1;
			let lastDay = lastDate.getDay();
			if(lastMonth > templateDate.Month || (lastMonth === templateDate.Month && lastDay > templateDate.Day)) {
				year++;
			}
			let date = new Date(0);
			date.setYear(year);
			date.setMonth(templateDate.Month - 1);
			date.setDate(templateDate.Day);
			return date;
			break;
			default:
				break;
		}
	}
}

export function toDate(date) {
	if(typeof(date) === 'string') {
		return new Date(date);
	} else {
		return date;
	}
}
