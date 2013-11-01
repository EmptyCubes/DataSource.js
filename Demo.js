(function ($) {
    $(function() {


        var source = new DataSource("Data.json");
        var petOwners = new DataSource("Pets.json");
        var target = new DataSource("target.json");
        var child = new DataSource("Child.json");
        var duplicates = new DataSource("Duplicates.json");

        var output = $('#output');

        //
        //Where & OrderByDesc
        //

        var query =
            source.where('m=>m.Id > 3 && m.Id < 6')
                .orderByDescending('m=>m.Name');

        output.append('<b>Where & OrderByDesc</b>');
        output.append("<br />");
        $.each(query.toArray(), function(i, o) {
            output.append("Id = " + o.Id + ", Name = " + o.Name);
            output.append("<br />");
        });

        //
        //First
        //

        output.append("<br />");
        output.append('<b>First</b>');
        output.append("<br />");
        var o = source.first('m=>m.Id > 3');
        output.append("Id = " + o.Id + ", Name = " + o.Name);
        output.append("<br />");

        //
        //First Exception
        //

        output.append("<br />");
        output.append('<b>First exception.</b>');
        output.append("<br />");
        try {
            o = source.first('m=>m.Id > 7');
            output.append("Id = " + o.Id + ", Name = " + o.Name);
        } catch(e) {
            output.append('' + e);
        }
        output.append("<br />");

        //
        //FirstOrDefault
        //

        output.append("<br />");
        output.append('<b>FirstOrDefault</b>');
        output.append("<br />");
        o = source.firstOrDefault('m=>m.Id == 8');
        if (o === null) output.append('NULL');
        else output.append("Id = " + o.Id + ", Name = " + o.Name);
        output.append("<br />");

        //
        //Skip & Take
        //

        query = source.skip(3)
            .take(2);

        output.append("<br />");
        output.append('<b>Skip & Take</b>');
        output.append("<br />");
        $.each(query.toArray(), function(i, o) {
            output.append("Id = " + o.Id + ", Name = " + o.Name);
            output.append("<br />");
        });

        //
        //Count
        //

        var i = source.count('m=>m.Id > 4');
        output.append("<br />");
        output.append('<b>Count</b>');
        output.append("<br />");
        output.append(i);
        output.append("<br />");

        //
        //Any
        //

        output.append("<br />");
        output.append('<b>Any</b>');
        output.append("<br />");
        output.append('m.Id > 4 = ' + source.any('m=>m.Id > 4'));
        output.append("<br />");
        output.append('m.Id > 8 = ' + source.any('m=>m.Id > 8'));
        output.append("<br />");

        //
        //Select
        //

        query = petOwners.select('m=>m.Pets');

        output.append("<br />");
        output.append('<b>Select</b>');
        output.append("<br />");
        $.each(query.toArray(), function(i, o) {
            output.append(o.join());
            output.append("<br />");
        });
        output.append("<br />");

        //
        //Select Many
        //

        query = petOwners.selectMany('m=>m.Pets');

        output.append("<br />");
        output.append('<b>Select Many</b>');
        output.append("<br />");
        $.each(query.toArray(), function(i, o) {
            output.append(o);
            output.append("<br />");
        });
        output.append("<br />");

        //
        //Union
        //

        query = source.union(target);

        output.append("<br />");
        output.append('<b>Union</b>');
        output.append("<br />");
        $.each(query.toArray(), function(i, o) {
            output.append("Id = " + o.Id + ", Name = " + o.Name);
            output.append("<br />");
        });
        output.append("<br />");

        //
        //Reverse
        //

        //query = source.reverse();

        //output.append("<br />");
        //output.append('<b>Reverse</b>');
        //output.append("<br />");
        //$.each(query.toArray(), function (i, o) {
        //    output.append("Id = " + o.Id + ", Name = " + o.Name);
        //    output.append("<br />");
        //});
        //output.append("<br />");

        //
        //Max
        //

        query = source.max('m=>m.Id');

        output.append("<br />");
        output.append('<b>Max</b>');
        output.append("<br />");
        output.append(query);
        output.append("<br />");

        //
        //Min
        //

        query = source.min('m=>m.Id');

        output.append("<br />");
        output.append('<b>Min</b>');
        output.append("<br />");
        output.append(query);
        output.append("<br />");

        //
        //Distinct
        //

        query = duplicates.distinct();

        output.append("<br />");
        output.append('<b>Distinct</b>');
        output.append("<br />");
        $.each(query.toArray(), function(i, o) {
            output.append("Id = " + o.Id + ", Name = " + o.Name);
            output.append("<br />");
        });

        //
        //Zip
        //

        var numbers = [1, 2, 3, 4];
        var words = ["one", "two", "three"];

        var numbersAndWords = numbers.zip(words, '(first, second) => first + " " + second');

        output.append("<br />");
        output.append('<b>Zip</b>');
        output.append("<br />");
        $.each(numbersAndWords, function(i, o) {
            output.append(o);
            output.append("<br />");
        });

        //
        //InnerJoin
        //

        var joined = source.innerJoin(child, 'm=>m.Id', 'm=>m.Id', '(source, child) => source.Name + " - " + child.Name');

        output.append("<br />");
        output.append('<b>InnerJoin</b>');
        output.append("<br />");
        $.each(joined.toArray(), function(i, o) {
            output.append(o);
            output.append("<br />");
        });
    });
})(jQuery);