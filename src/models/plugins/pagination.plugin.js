const paginate = (schema) => {
	// eslint-disable-next-line require-await, func-names
	schema.statics.paginate = async function (filter, options) {
		let sort = "";
		if (options.sortBy) {
			const sortingCriteria = [];
			options.sortBy.split(",").forEach((sortOption) => {
				const [key, order] = sortOption.split(":");
				sortingCriteria.push((order === "desc" ? "-" : "") + key);
			});

			sort = sortingCriteria.join(" ");
		} else {
			sort = "-createdAt";
		}

		const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
		const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
		const skip = (page - 1) * limit;

		const countPromise = this.countDocuments(filter).exec();
		let docsPromise = this.find(filter).collation({ locale: "en" }).sort(sort).skip(skip)
			.limit(limit);

		if (options.populate && options.populate.length) {
			options.populate.forEach((populateOption) => {
				docsPromise = docsPromise.populate(populateOption);
			});
		}

		docsPromise = docsPromise.exec();

		return Promise.all([countPromise, docsPromise]).then((values) => {
			const [totalResults, results] = values;
			const totalPages = Math.ceil(totalResults / limit);
			const result = {
				results,
				page,
				limit,
				totalPages,
				totalResults
			};
			return Promise.resolve(result);
		});
	};
};

module.exports = paginate;