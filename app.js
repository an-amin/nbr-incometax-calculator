(main)(jQuery)

function main($)
{
    $(document).on('click', '#about', ()=>$(document).find('#about-modal').modal('toggle'));
    $(document).on('click', '#toggle-theme', toggleTheme);
    $(document).on('change', '#tax-zone', ()=>$('#input-min-payable-tax').val($('#tax-zone').val()).trigger('change'));

    $(document).on('change', '#category', function(){
        $(document).find('#tax-free-income').val($(this).val()).trigger('change');
        $(document).find('.tax-free-income').text($(this).val());
        calculateTaxableIncome();

    });

    $(document).on('keyup', '#monthly-basic', function(){
        calculateBasic(Number($(this).val())*12);
    });
    $(document).on('keyup', '#yearly-basic', function(){
        calculateBasic(Number($(this).val()));
    });


    $(document).on('keyup', '#monthly-houserent', function(){
        calculateHouseRent(Number($(this).val())*12);
    });
    $(document).on('keyup', '#yearly-houserent', function(){
        calculateHouseRent(Number($(this).val()));
    });


    $(document).on('keyup', '#monthly-medical', function(){
        calculateMedical(Number($(this).val())*12);
    });
    $(document).on('keyup', '#yearly-medical', function(){
        calculateMedical(Number($(this).val()));
    });
    

    $(document).on('keyup', '#monthly-conveyance', function(){
        calculateConveyance(Number($(this).val())*12);
    });
    $(document).on('keyup', '#yearly-conveyance', function(){
        calculateConveyance(Number($(this).val()));
    });


    $(document).on('keyup', '#yearly-festival', function(){
        calculateFestival(Number($(this).val()));
    });

    $(document).on('keyup', '.input-investment', function(){
        let totalInvestment = 0;
        $.each($(document).find('.input-investment'), function(i,input){
            totalInvestment += Number($(input).val());
        });
        $(document).find('#total-investment').val(totalInvestment).trigger('change');
        calculateTaxableIncome();

    });
    
    $(document).on('keyup', '#input-tds-ait', function(){
        $(document).find('#tds-ait').text($(this).val());
        calculateTaxableIncome();

    });
}

function calculateBasic(yearlyBasic)
{
    let monthlyBasic = yearlyBasic/12;
    let taxFreeBasic = Number($(document).find('#taxfree-basic').val());
    $(document).find('#monthly-basic').val(yearlyBasic/12).trigger('change');
    $(document).find('#yearly-basic').val(yearlyBasic).trigger('change');
    $(document).find('#taxable-basic').val(yearlyBasic-taxFreeBasic).trigger('change');
    $(document).find('#taxfree-houserent').val(yearlyBasic*0.50).trigger('change');
    $(document).find('#taxfree-medical').val(yearlyBasic*0.10).trigger('change');
    calculateTaxableIncome();

}


function calculateHouseRent(yearlyHouseRent)
{
    let monthlyHouseRent = yearlyHouseRent/12;
    let taxFreeHouseRent = Number($(document).find('#taxfree-houserent').val());
    $(document).find('#monthly-houserent').val(yearlyHouseRent/12).trigger('change');
    $(document).find('#yearly-houserent').val(yearlyHouseRent).trigger('change');
    $(document).find('#taxable-houserent').val(yearlyHouseRent-taxFreeHouseRent>0?yearlyHouseRent-taxFreeHouseRent:0).trigger('change');
    calculateTaxableIncome();

}


function calculateMedical(yearlyMedical)
{
    let monthlyMedical = yearlyMedical/12;
    let taxFreeMedical = Number($(document).find('#taxfree-medical').val());
    $(document).find('#monthly-medical').val(yearlyMedical/12).trigger('change');
    $(document).find('#yearly-medical').val(yearlyMedical).trigger('change');
    $(document).find('#taxable-medical').val(yearlyMedical-taxFreeMedical>0?yearlyMedical-taxFreeMedical:0).trigger('change');
    calculateTaxableIncome();
}


function calculateConveyance(yearlyConveyance)
{
    let monthlyConveyance = yearlyConveyance/12;
    let taxFreeConveyance = Number($(document).find('#taxfree-conveyance').val());
    $(document).find('#monthly-conveyance').val(yearlyConveyance/12).trigger('change');
    $(document).find('#yearly-conveyance').val(yearlyConveyance).trigger('change');
    $(document).find('#taxable-conveyance').val(yearlyConveyance-taxFreeConveyance>0?yearlyConveyance-taxFreeConveyance:0).trigger('change');
    calculateTaxableIncome();
}


function calculateFestival(yearlyFestival)
{
    $(document).find('#taxable-festival').val(yearlyFestival).trigger('change');
    calculateTaxableIncome();
}


function calculateTaxableIncome()
{
    let sumMonthly = 0;
    $.each($('#salary-income-matrix tbody td:nth-child(2) input'), function(i,input){
        console.log(Number($(input).val()));
        sumMonthly += Number($(input).val());
    });
    $(document).find('#subtotal-monthly').val(sumMonthly).trigger('change');

    let sumYearly = 0;
    $.each($('#salary-income-matrix tbody td:nth-child(3) input'), function(i,input){
        console.log(Number($(input).val()));
        sumYearly += Number($(input).val());
    });
    $(document).find('#subtotal-yearly').val(sumYearly).trigger('change');

    let sumTaxfree = 0;
    $.each($('#salary-income-matrix tbody td:nth-child(4) input'), function(i,input){
        console.log(Number($(input).val()));
        sumTaxfree += Number($(input).val());
    });
    $(document).find('#subtotal-taxfree').val(sumTaxfree).trigger('change');

    let sumTaxable = 0;
    $.each($('#salary-income-matrix tbody td:nth-child(5) input'), function(i,input){
        console.log(Number($(input).val()));
        sumTaxable += Number($(input).val());
    });
    $(document).find('#subtotal-taxable').val(sumTaxable).trigger('change');
    $(document).find('#total-taxable-income').text(sumTaxable);
    let investmentable = sumTaxable*0.20<1000000?sumTaxable*0.20:1000000;
    let expectedTaxRebate = investmentable*0.15;
    $(document).find('#max-investmentable').val(investmentable).trigger('change');
    $(document).find('#expected-tax-rebate').val(expectedTaxRebate).trigger('change');
    // console.log(sumMonthly, sumYearly, sumTaxfree, sumTaxable)
    calculateGrossTax();
}


function calculateGrossTax()
{
    let taxFreeAmount = Number($(document).find('#tax-free-income').val());
    let taxableAmount = Number($(document).find('#subtotal-taxable').val());
    let remaining = taxableAmount;
    let totalGrossTax = 0;

    $.each($(document).find('#tax-chart tbody tr'), function(i,tr){
        let range = Number($(tr).find('td>span').text());
        let percentage = Number($(tr).find('td:nth-child(2)').text())/100;
        if(remaining<=range || range==0)
            range = remaining;
        
        tax = range*percentage;
        remaining -= range;
        
        let actualRemaining = remaining>0?remaining:0;

        // console.log(range, percentage, tax, actualRemaining);
        totalGrossTax += tax;
        $(tr).find('td:nth-child(3)').text(tax);
        $(tr).find('td:nth-child(4)').text(actualRemaining);
        $(document).find('#total-gross-tax').text(totalGrossTax);
    });

    let maxInvestmentable = Number($(document).find('#max-investmentable').val());
    let totalInvestment = Number($(document).find('#total-investment').val());
    let investment = totalInvestment > maxInvestmentable ? maxInvestmentable : totalInvestment;
    let investmentRebate = investment*0.15;
    $(document).find('#investment-rebate').text(investmentRebate);


    let ait = Number($(document).find('#input-tds-ait').val());
    $(document).find('#tds-ait').text(ait);

    let netTaxLiability = totalGrossTax-investmentRebate-ait;
    $(document).find('#net-tax-liability').text(netTaxLiability<0?0:netTaxLiability);
    
}


function toggleTheme()
{
    let icon = '';
    let theme = $('html').attr('data-bs-theme');
    if(theme =='dark')
    {
        theme = 'light';
        icon = '☀️';
    }
    else
    {
        theme = 'dark';
        icon = '🌙';
    }
    $('html').attr('data-bs-theme', theme);
    $(this).text(icon);
}