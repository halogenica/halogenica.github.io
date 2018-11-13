function hoverScrub() {
    hoverScrubPrecisionVariable=.05;
    $(".spotPreviewEvent").mouseenter(function () {
        var thisThing = $(this);
        var thisThingImage = $(thisThing).find("img");
        var originalSourceImageUrl = thisThingImage.attr("data-orig");
        var thumbnailCount = thisThingImage.attr("data-thumbcount") - 1;
        if (originalSourceImageUrl !== undefined) {
            var thumbIndexNumber, middleFrame, currentFrameSource;
            thumbIndexNumber = originalSourceImageUrl.indexOf('IMAGE_') + 6;
            middleFrame = originalSourceImageUrl.substr(thumbIndexNumber, 4);
            currentFrameSource = originalSourceImageUrl.substr(thumbIndexNumber, 4);

            //when switching between expanded and condensed views, the thumbcount gets lost, so it is recalculated here
            if (isNaN(thumbnailCount)) {
                thumbnailCount = (middleFrame * 2) - 2;
            }
            var preloadFrameNumberFourDigits, preloadImageUrl;
            var currentFrameSource = originalSourceImageUrl.substr(thumbIndexNumber, 4);
            var currentFrameNumberFourDigits = '_' + ('000' + currentFrameSource).substr(-4);

            var stepDistance = Math.round(thumbnailCount*hoverScrubPrecisionVariable);
            if (stepDistance == 0) {
                stepDistance = 1;
            }
            for (i = 1; i < thumbnailCount; i+=stepDistance) {
                preloadFrameNumberFourDigits = '_' + ('000' + i).substr(-4);
                preloadImageUrl = originalSourceImageUrl.replace(currentFrameNumberFourDigits, preloadFrameNumberFourDigits);
                $('.preloadedImages').append("<img src='"+preloadImageUrl+"'/>");
            }
            //make sure the last thumb is actually the final storyboard image
            preloadFrameNumberFourDigits = '_' + ('000' + thumbnailCount).substr(-4);
            preloadImageUrl = originalSourceImageUrl.replace(currentFrameNumberFourDigits, preloadFrameNumberFourDigits);
            $('.preloadedImages').append("<img src='"+preloadImageUrl+"'/>");
        }
    }).mousemove(function (e) {
        var offset = $(this).offset();
        var relativeX = (e.pageX - offset.left);
        var scrubber = $(this).find('.scrub-cursor');
        scrubber.css('marginLeft', relativeX - 1 + 'px').show();
        var thisThing = $(this);
        var thisThingImage = $(thisThing).find("img");
        var thumbnailPixelsWidth = thisThingImage.css("width");
        var imageUrl = thisThingImage.attr("src");
        var originalSourceImageUrl = thisThingImage.attr("data-orig");
        var thumbnailCount = thisThingImage.attr("data-thumbcount") - 1;
        var thumbIndexNumber, middleFrame, currentFrameSource;
        if (originalSourceImageUrl !== undefined) {
            thumbIndexNumber = originalSourceImageUrl.indexOf('IMAGE_') + 6;
            middleFrame = originalSourceImageUrl.substr(thumbIndexNumber, 4);
            currentFrameSource = imageUrl.substr(thumbIndexNumber, 4);
            var percentageLocation = relativeX / parseInt(thumbnailPixelsWidth);
            if (isNaN(thumbnailCount)) {
                thumbnailCount = (middleFrame * 2) - 2;
            }
            //console.log(thumbnailCount);
            var numberOfThumbsPreloaded = $('.preloadedImages img').length;

            var desiredFrameNumber = Math.floor(numberOfThumbsPreloaded * percentageLocation);
            if (desiredFrameNumber < 1) { desiredFrameNumber = 1; }

            if (desiredFrameNumber>numberOfThumbsPreloaded) {
                desiredFrameNumber=numberOfThumbsPreloaded;
            }
            var newImageUrl = $('.preloadedImages img')[(desiredFrameNumber-1)].src;
            thisThingImage.attr("src", newImageUrl);
            $('.thumbPreviewWindow img').attr('src', newImageUrl);
            $('.thumbPreviewWindow').show();

        }
    }).mouseleave(function () {
        $(this).find('.scrub-cursor').hide();
        $('.thumbPreviewWindow').hide();
        $('.preloadedImage').empty();
    });
}
function replaceOriginalImage(theElement) {
    var orig = theElement.attr('data-orig');
    theElement.attr('src', orig);
}
hoverScrub();