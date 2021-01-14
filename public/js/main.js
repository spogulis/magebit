$(function() {
    let submitBtn = $('#submit-btn');

    // Validate and submit form on click
    submitBtn.on('click', (e) => {
        e.preventDefault();
        let valid = doValidate();

        if (valid) {
            $('#subscription-form').trigger('submit');
        }
    });

    // Validate submission by 'Enter' key
    $('#email').on('keydown', function(e){
        if(e.key === 'Enter') {
          e.preventDefault();
          doValidate() === true ? true : false;
        }
    });

    // Validate on input field change event
    $('#email').on('keyup', () => {
        doValidate() ? submitBtn.removeAttr('disabled') : submitBtn.prop('disabled', true);
    });
    
    // Validate on checkbox change event
    $('#tos-checkbox').on('change', () => {
        doValidate() ? submitBtn.removeAttr('disabled') : submitBtn.prop('disabled', true);
    });
    
    // Filter results by search key up event
    $('#email-search').on('keyup', (e) => {
        const val = e.target.value;
        
        if (val == '') {
            const prevActivePageEl = $('#nav .pagination-link.active');
            const prevActivePage = prevActivePageEl.length == 0 ? 1 : parseInt(prevActivePageEl.html());
            const activeRows = $('#data tbody tr.filtered');
            const rowsTotal = activeRows.length;
            const numPages = rowsTotal/rowsShown;
            let activePage = 1;

            prevActivePage > Math.ceil(numPages) ? activePage = Math.ceil(numPages) : activePage = prevActivePage;

            const filters = getFilteredByEmailProviders();
            $.each(filters, (index, filter) => {
                filterByEmailProvider(filter, true);
            });
            
            initPagination(10, prevActivePage);
            getPaginated(activePage, rowsShown, false);
        }
        else {
            searchEmail(e.target.value);
        }
    });

    // Get all subscriptions from db and email provider filter buttons
    axios.get('/subscriptions/getall').then((resp) => {
        const records = resp.data;
        getEmailFilters(records);
    }).catch((error) => {
        console.log(error);
    });

    // Sorted and paginated subscription results table
    const rowsShown = 10;
    sortBy(true);
    initPagination(rowsShown);

    // Handle page click event
    $(document).on('click', '.pagination-link', (paginatedEl) => {
        const filters = getFilteredByEmailProviders();

        $.each(filters, (index, filter) => {
            filterByEmailProvider(filter, true);
        });

        getPaginated(paginatedEl, rowsShown, true);
    });
    
    // Perform email provider filter action
    $(document).on('click', '.email-filter', (el) => {
        let element = $(el.target);
        let filter = element.attr('provider');
        let isActive = element.hasClass('active');
        isActive ? element.removeClass('active') : element.addClass('active');
        isActive = element.hasClass('active');
        
        isActive ? filterByEmailProvider(filter, true) : filterByEmailProvider(filter, false);

        
        // Get active email provider filter values
        const filters = getFilteredByEmailProviders();
        $.each(filters, (index, filter) => {
            filterByEmailProvider(filter, true);
        });
        
        // Hide results that aren't part of search query
        const emailFilterVal = $('#email-search').val();
        if (emailFilterVal != '') {
            searchEmail(emailFilterVal);
        }

        // Recalculate active page
        const prevActivePageEl = $('#nav .pagination-link.active');
        const prevActivePage = prevActivePageEl.length == 0 ? 1 : parseInt(prevActivePageEl.html());
        const activeRows = $('#data tbody tr.filtered');
        const rowsTotal = activeRows.length;
        const numPages = Math.ceil(rowsTotal/rowsShown);
        let activePage = 1;

        // Set active page
        prevActivePage > numPages ? activePage = numPages : activePage = prevActivePage; 

        prevActivePageEl.addClass('active');
        initPagination(10, prevActivePage);
        getPaginated(activePage, 10);
    });
    
    // Sort by email
    $('#email-th').on('click', (e) => {
        const visibleArrow = $('#email-th span:not(.d-none)');
        const target = $(e.target);
        let hiddenArrow, 
            ascending;
        
        $('#date-registered-th span').addClass('d-none');

        if (visibleArrow.length < 1) {
            hiddenArrow = $('#email-th span:nth-child(1)');
            ascending = true;

        }
        else {
            hiddenArrow = $('#email-th span.d-none');
            ascending = target.hasClass('ascending');
        };
        
        if (ascending) {
            sortBy(false, !ascending);
            target.removeClass('ascending');
            hiddenArrow.removeClass('d-none');
            visibleArrow.addClass('d-none');
        }
        else {
            sortBy(false, ascending);
            target.addClass('ascending');
            hiddenArrow.removeClass('d-none') && visibleArrow.addClass('d-none')
        };

        recalculateAndPaginate();
    });
    
    // Sort by date registered
    $('#date-registered-th').on('click', (e) => {
        const visibleArrow = $('#date-registered-th span:not(.d-none)');
        const target = $(e.target);
        let hiddenArrow, 
            ascending;
        
        $('#email-th span').addClass('d-none');
        
        if (visibleArrow.length < 1) {
            hiddenArrow = $('#date-registered-th span:nth-child(1)');
            ascending = true;

        }
        else {
            hiddenArrow = $('#date-registered-th span.d-none');
            ascending = target.hasClass('ascending');
        };
        
        if (ascending) {
            sortBy(!ascending);
            target.removeClass('ascending')
            hiddenArrow.removeClass('d-none');
            visibleArrow.addClass('d-none');
        }
        else {
            sortBy(ascending);
            target.addClass('ascending');
            hiddenArrow.removeClass('d-none') && visibleArrow.addClass('d-none')
        };

        recalculateAndPaginate();
    })
});

function recalculateAndPaginate() {
    const prevActivePageEl = $('#nav .pagination-link.active');
    const prevActivePage = prevActivePageEl.length == 0 ? 1 : parseInt(prevActivePageEl.html());
    const activeRows = $('#data tbody tr.filtered');
    const rowsTotal = activeRows.length;
    const numPages = Math.ceil(rowsTotal/10);
    let activePage = 1;

    prevActivePage > numPages ? activePage = numPages : activePage = prevActivePage; 

    prevActivePageEl.addClass('active');
    initPagination(10, prevActivePage);
    getPaginated(activePage, 10);
}

function sortBy(ascending, date = true) {
    const rows = $('#data tbody tr.filtered');

    rows.each(function() {
        var $this = $(this);
        date ? t = this.cells[1].textContent.split('-') : t = this.cells[0];
        date ?? $this.data('_ts', new Date(t[0], t[1]-1, t[2]).getTime());
    }).sort(function (a, b) {
       if (ascending) {
           if (date) {
            return $(a).data('_ts') < $(b).data('_ts') ? -1 : 1;
           }

           return $(a).val() < $(b).val() ? -1 : 1;
        }
        
        if (date) {
            return $(a).data('_ts') < $(b).data('_ts') ? 1 : -1;
        }
        
        return $(a).val() > $(b).val() ? 1 : -1;
    }).appendTo('#data tbody');
};

function searchEmail(email) {
    const rows = $('#data tbody tr');
    const disabledProviders = getDisabledByEmailProviders();
    
    rows.each((key, row) => {
        let rowObj = $(row);
        let rowEmail = rowObj.children().first().html();

        // Skip if email contains disabled provider substring
        let skipRow = false;
        $.each(disabledProviders, (key, provider) => {
            if (rowEmail.includes(provider)) {
                rowObj.removeClass('filtered');
                skipRow = true;

                return false;
            }
        });
        
        if (!skipRow) {
            let substringIncluded = rowEmail.includes(email) ?? true;
            if (substringIncluded && email != '') {
                rowObj.addClass('filtered');
            }
            else {
                rowObj.removeClass('filtered');
            };
        }
    });

    // Repaginate
    const prevActivePageEl = $('#nav .pagination-link.active');
    const prevActivePage = prevActivePageEl.length == 0 ? 1 : parseInt(prevActivePageEl.html());
    const activeRows = $('#data tbody tr.filtered');
    const rowsTotal = activeRows.length;
    const numPages = rowsTotal/10;
    let activePage = 1;

    prevActivePage > numPages ? activePage = numPages : activePage = prevActivePage; 
    $('#data tbody tr:not(.filtered)').css('opacity','0.0').hide();

    initPagination(10);
    getPaginated(activePage, 10);

    return false;
};

function initPagination(rowsShown, index = 0) {
    const activeRows = $('#data tbody tr.filtered');
    const rowsTotal = activeRows.length;
    const numPages = rowsTotal/rowsShown;
    
    // Remove nav links on 2nd call
    if ($('#nav').length) {
        $('#nav a').remove();
    }
    else {
        $('#data').after('<div id="nav"></div>');
    }
    
    for(i = 0;i < numPages;i++) {
        let pageNum = i + 1;
        $('#nav').append('<a href="#" class="pagination-link" rel="'+i+'">'+pageNum+'</a> ');
    }

    activeRows.hide();
    activeRows.slice(0, rowsShown).show();

    if (index > 0) {
        const activePage = '#nav a:nth-child(' + index + ')';
        $(activePage).addClass('active');
    }
    else {
        $('#nav a:first').addClass('active');
    }
    
    $('.form-wrapper').addClass('h-100');
};

function getPaginated(paginatedEl, rowsShown, pageClick = false) {
    let currPage;

    if (pageClick) {
        $('#nav a').removeClass('active');
        $(paginatedEl.target).addClass('active');
        currPage = $(paginatedEl.target).attr('rel');
    }
    else {
        currPage = paginatedEl - 1;
    }

    var startItem = (rowsShown * (parseInt(currPage) + 1)) - 10;
    var endItem = startItem + rowsShown;

    $('#data tbody tr.filtered').css('opacity','0.0')
                                .hide()
                                .slice(startItem, endItem)
                                .css('display','table-row')
                                .animate({opacity:1}, 300);
};

function getFilteredByEmailProviders() {
    const active = $('.email-filter.active');
    let filters = [];

    $.each(active, (index, el) => {
        filters.push($(el).attr('provider'));
    })

    return filters;
};

function getDisabledByEmailProviders() {
    const disabled = $('.email-filter:not(.active)');
    let filters = [];

    $.each(disabled, (index, el) => {
        filters.push($(el).attr('provider'));
    })

    return filters;
};

function filterByEmailProvider(provider, isActive) {
    const rows = $('#data tbody tr');
    let filteredRows = [];
    
    rows.each((id, row) => {
        let email = $(row).children().first();
        email = $(email);
        emailContent = $(email).html();
        
        if (emailContent.includes('@' + provider + '.')) {
            let row = $(email).parent();

            if (isActive) {
                row.css('opacity','1.0').show();
                row.addClass('filtered');
                filteredRows.push(row);
            }
            else {
                row.css('opacity','0.0').hide();
                row.removeClass('filtered');
            }
        }
    });

    return filteredRows.length;
}

function getEmailFilters(data) {
    let providers = [];

    data.forEach(element => {
        let emailProvider = element['email'].split('@')[1];
        emailProvider = emailProvider.substring(0, emailProvider.lastIndexOf('.'));
        
        if (providers.includes(emailProvider)) {
            return;
        }
        else {
            providers.push(emailProvider);
        }
    });

    for (i = 0; i <= providers.length - 1; i++) {
        $('.email-filters').append('<button class="email-filter active" provider="' + providers[i] + '">' + providers[i] + '</button>')
    };
};

function deleteSubscription(el) {
    const btn = $(el);
    
    axios.post('/subscription/delete', {
        id: btn.attr('subid')
    }).then((resp) => {
        if (resp.status = 200) {
            el.closest('tr').remove();
        };
    }).catch((error) => {
        console.log(error);
    })
};

function doValidate() {
    const email = $('#email');
    const tosCheckbox = $('#tos-checkbox');
    const tosChecked = tosCheckbox.is(':checked');
    let errorWrapper = $('.error-wrapper');
    errorWrapper.empty();

    const formValues = {
        emailEmpty: createEmailEmptyValidation(email.val()),
        emailInvalid: createEmailInvalidValidation(email.val()),
        emailProhibited: createEmailProhibitedValidation(email.val()),
        tos: createTosValidation(tosChecked)
    };

    const errors = validateFormValues(formValues);
    
    errors.every((key)=> {
        let value = Object.values(key)[0];
        
        if (value == true) {
            return true;
        }
        else {
            errorWrapper.append('<span class="error-msg">' + value + '</span>');
            return false;
        }
    });

    return errorWrapper.children().length > 0 ? false : true;
};

function validateEmail(email) {
    const re = RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    
    return re.test(String(email).toLowerCase());
};

const createValidation = (fn, errorMsg, type) => data => {
    const result = fn(data);

    return {
      cata: branch =>
        result ? branch.right(result, type) : branch.left(errorMsg, type),
      type
    };
};

const validateFormValues = values =>
  Object.keys(values).map(key => ({
    [key]: values[key].cata({
      left: e => e,
      right: a => a
    })
}));

const EMAIL = "EMAIL";
const TOS = "TOS";
const PROHIBITED = ".co"
    
const createEmailInvalidValidation = createValidation(
    email => validateEmail(email),
    'Please provide a valid e-mail address',
    EMAIL
);

const createEmailEmptyValidation = createValidation(
    email => email.length  > 0,
    'Email address is required',
    EMAIL
);

const createEmailProhibitedValidation = createValidation(
    email => !email.endsWith(PROHIBITED),
    'We are not accepting subscriptions from Colombia emails',
    EMAIL
);

const createTosValidation = createValidation(
    tos => tos,
    'You must accept the terms and conditions',
    TOS
);
