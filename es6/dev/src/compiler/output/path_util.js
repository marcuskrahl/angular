import { BaseException } from 'angular2/src/facade/exceptions';
import { isPresent, isBlank, RegExpWrapper, Math } from 'angular2/src/facade/lang';
// asset:<package-name>/<realm>/<path-to-module>
var _ASSET_URL_RE = /asset:([^\/]+)\/([^\/]+)\/(.+)/g;
var _PATH_SEP = '/';
var _PATH_SEP_RE = /\//g;
export var ImportEnv;
(function (ImportEnv) {
    ImportEnv[ImportEnv["Dart"] = 0] = "Dart";
    ImportEnv[ImportEnv["JS"] = 1] = "JS";
})(ImportEnv || (ImportEnv = {}));
/**
 * Returns the module path to use for an import.
 */
export function getImportModulePath(moduleUrlStr, importedUrlStr, importEnv) {
    var absolutePathPrefix = importEnv === ImportEnv.Dart ? `package:` : '';
    var moduleUrl = _AssetUrl.parse(moduleUrlStr, false);
    var importedUrl = _AssetUrl.parse(importedUrlStr, true);
    if (isBlank(importedUrl)) {
        return importedUrlStr;
    }
    // Try to create a relative path first
    if (moduleUrl.firstLevelDir == importedUrl.firstLevelDir &&
        moduleUrl.packageName == importedUrl.packageName) {
        return getRelativePath(moduleUrl.modulePath, importedUrl.modulePath, importEnv);
    }
    else if (importedUrl.firstLevelDir == 'lib') {
        return `${absolutePathPrefix}${importedUrl.packageName}/${importedUrl.modulePath}`;
    }
    throw new BaseException(`Can't import url ${importedUrlStr} from ${moduleUrlStr}`);
}
class _AssetUrl {
    constructor(packageName, firstLevelDir, modulePath) {
        this.packageName = packageName;
        this.firstLevelDir = firstLevelDir;
        this.modulePath = modulePath;
    }
    static parse(url, allowNonMatching) {
        var match = RegExpWrapper.firstMatch(_ASSET_URL_RE, url);
        if (isPresent(match)) {
            return new _AssetUrl(match[1], match[2], match[3]);
        }
        if (allowNonMatching) {
            return null;
        }
        throw new BaseException(`Url ${url} is not a valid asset: url`);
    }
}
export function getRelativePath(modulePath, importedPath, importEnv) {
    var moduleParts = modulePath.split(_PATH_SEP_RE);
    var importedParts = importedPath.split(_PATH_SEP_RE);
    var longestPrefix = getLongestPathSegmentPrefix(moduleParts, importedParts);
    var resultParts = [];
    var goParentCount = moduleParts.length - 1 - longestPrefix;
    for (var i = 0; i < goParentCount; i++) {
        resultParts.push('..');
    }
    if (goParentCount <= 0 && importEnv === ImportEnv.JS) {
        resultParts.push('.');
    }
    for (var i = longestPrefix; i < importedParts.length; i++) {
        resultParts.push(importedParts[i]);
    }
    return resultParts.join(_PATH_SEP);
}
export function getLongestPathSegmentPrefix(arr1, arr2) {
    var prefixSize = 0;
    var minLen = Math.min(arr1.length, arr2.length);
    while (prefixSize < minLen && arr1[prefixSize] == arr2[prefixSize]) {
        prefixSize++;
    }
    return prefixSize;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1jY1VUdWdCOS50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL291dHB1dC9wYXRoX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckQsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUMsTUFBTSwwQkFBMEI7QUFFaEYsZ0RBQWdEO0FBQ2hELElBQUksYUFBYSxHQUFHLGlDQUFpQyxDQUFDO0FBRXRELElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUNwQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7QUFFekIsV0FBWSxTQUdYO0FBSEQsV0FBWSxTQUFTO0lBQ25CLHlDQUFJLENBQUE7SUFDSixxQ0FBRSxDQUFBO0FBQ0osQ0FBQyxFQUhXLFNBQVMsS0FBVCxTQUFTLFFBR3BCO0FBRUQ7O0dBRUc7QUFDSCxvQ0FBb0MsWUFBb0IsRUFBRSxjQUFzQixFQUM1QyxTQUFvQjtJQUN0RCxJQUFJLGtCQUFrQixHQUFXLFNBQVMsS0FBSyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDaEYsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckQsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsSUFBSSxXQUFXLENBQUMsYUFBYTtR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Q25CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEQsT0FBTyxVQUFVLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUNuRSxVQUFVLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgUmVnRXhwV3JhcHBlciwgTWF0aH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuLy8gYXNzZXQ6PHBhY2thZ2UtbmFtZT4vPHJlYWxtPi88cGF0aC10by1tb2R1bGU+XG52YXIgX0FTU0VUX1VSTF9SRSA9IC9hc3NldDooW15cXC9dKylcXC8oW15cXC9dKylcXC8oLispL2c7XG5cbnZhciBfUEFUSF9TRVAgPSAnLyc7XG52YXIgX1BBVEhfU0VQX1JFID0gL1xcLy9nO1xuXG5leHBvcnQgZW51bSBJbXBvcnRFbnYge1xuICBEYXJ0LFxuICBKU1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIG1vZHVsZSBwYXRoIHRvIHVzZSBmb3IgYW4gaW1wb3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0TW9kdWxlUGF0aChtb2R1bGVVcmxTdHI6IHN0cmluZywgaW1wb3J0ZWRVcmxTdHI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEVudjogSW1wb3J0RW52KTogc3RyaW5nIHtcbiAgdmFyIGFic29sdXRlUGF0aFByZWZpeDogc3RyaW5nID0gaW1wb3J0RW52ID09PSBJbXBvcnRFbnYuRGFydCA/IGBwYWNrYWdlOmAgOiAnJztcbiAgdmFyIG1vZHVsZVVybCA9IF9Bc3NldFVybC5wYXJzZShtb2R1bGVVcmxTdHIsIGZhbHNlKTtcbiAgdmFyIGltcG9ydGVkVXJsID0gX0Fzc2V0VXJsLnBhcnNlKGltcG9ydGVkVXJsU3RyLCB0cnVlKTtcbiAgaWYgKGlzQmxhbmsoaW1wb3J0ZWRVcmwpKSB7XG4gICAgcmV0dXJuIGltcG9ydGVkVXJsU3RyO1xuICB9XG5cbiAgLy8gVHJ5IHRvIGNyZWF0ZSBhIHJlbGF0aXZlIHBhdGggZmlyc3RcbiAgaWYgKG1vZHVsZVVybC5maXJzdExldmVsRGlyID09IGltcG9ydGVkVXJsLmZpcnN0TGV2ZWxEaXIgJiZcbiAgICAgIG1vZHVsZVVybC5wYWNrYWdlTmFtZSA9PSBpbXBvcnRlZFVybC5wYWNrYWdlTmFtZSkge1xuICAgIHJldHVybiBnZXRSZWxhdGl2ZVBhdGgobW9kdWxlVXJsLm1vZHVsZVBhdGgsIGltcG9ydGVkVXJsLm1vZHVsZVBhdGgsIGltcG9ydEVudik7XG4gIH0gZWxzZSBpZiAoaW1wb3J0ZWRVcmwuZmlyc3RMZXZlbERpciA9PSAnbGliJykge1xuICAgIHJldHVybiBgJHthYnNvbHV0ZVBhdGhQcmVmaXh9JHtpbXBvcnRlZFVybC5wYWNrYWdlTmFtZX0vJHtpbXBvcnRlZFVybC5tb2R1bGVQYXRofWA7XG4gIH1cbiAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYENhbid0IGltcG9ydCB1cmwgJHtpbXBvcnRlZFVybFN0cn0gZnJvbSAke21vZHVsZVVybFN0cn1gKTtcbn1cblxuY2xhc3MgX0Fzc2V0VXJsIHtcbiAgc3RhdGljIHBhcnNlKHVybDogc3RyaW5nLCBhbGxvd05vbk1hdGNoaW5nOiBib29sZWFuKTogX0Fzc2V0VXJsIHtcbiAgICB2YXIgbWF0Y2ggPSBSZWdFeHBXcmFwcGVyLmZpcnN0TWF0Y2goX0FTU0VUX1VSTF9SRSwgdXJsKTtcbiAgICBpZiAoaXNQcmVzZW50KG1hdGNoKSkge1xuICAgICAgcmV0dXJuIG5ldyBfQXNzZXRVcmwobWF0Y2hbMV0sIG1hdGNoWzJdLCBtYXRjaFszXSk7XG4gICAgfVxuICAgIGlmIChhbGxvd05vbk1hdGNoaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFVybCAke3VybH0gaXMgbm90IGEgdmFsaWQgYXNzZXQ6IHVybGApO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBhY2thZ2VOYW1lOiBzdHJpbmcsIHB1YmxpYyBmaXJzdExldmVsRGlyOiBzdHJpbmcsIHB1YmxpYyBtb2R1bGVQYXRoOiBzdHJpbmcpIHtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoKG1vZHVsZVBhdGg6IHN0cmluZywgaW1wb3J0ZWRQYXRoOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEVudjogSW1wb3J0RW52KTogc3RyaW5nIHtcbiAgdmFyIG1vZHVsZVBhcnRzID0gbW9kdWxlUGF0aC5zcGxpdChfUEFUSF9TRVBfUkUpO1xuICB2YXIgaW1wb3J0ZWRQYXJ0cyA9IGltcG9ydGVkUGF0aC5zcGxpdChfUEFUSF9TRVBfUkUpO1xuICB2YXIgbG9uZ2VzdFByZWZpeCA9IGdldExvbmdlc3RQYXRoU2VnbWVudFByZWZpeChtb2R1bGVQYXJ0cywgaW1wb3J0ZWRQYXJ0cyk7XG5cbiAgdmFyIHJlc3VsdFBhcnRzID0gW107XG4gIHZhciBnb1BhcmVudENvdW50ID0gbW9kdWxlUGFydHMubGVuZ3RoIC0gMSAtIGxvbmdlc3RQcmVmaXg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZ29QYXJlbnRDb3VudDsgaSsrKSB7XG4gICAgcmVzdWx0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuICBpZiAoZ29QYXJlbnRDb3VudCA8PSAwICYmIGltcG9ydEVudiA9PT0gSW1wb3J0RW52LkpTKSB7XG4gICAgcmVzdWx0UGFydHMucHVzaCgnLicpO1xuICB9XG4gIGZvciAodmFyIGkgPSBsb25nZXN0UHJlZml4OyBpIDwgaW1wb3J0ZWRQYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIHJlc3VsdFBhcnRzLnB1c2goaW1wb3J0ZWRQYXJ0c1tpXSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFBhcnRzLmpvaW4oX1BBVEhfU0VQKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvbmdlc3RQYXRoU2VnbWVudFByZWZpeChhcnIxOiBzdHJpbmdbXSwgYXJyMjogc3RyaW5nW10pOiBudW1iZXIge1xuICB2YXIgcHJlZml4U2l6ZSA9IDA7XG4gIHZhciBtaW5MZW4gPSBNYXRoLm1pbihhcnIxLmxlbmd0aCwgYXJyMi5sZW5ndGgpO1xuICB3aGlsZSAocHJlZml4U2l6ZSA8IG1pbkxlbiAmJiBhcnIxW3ByZWZpeFNpemVdID09IGFycjJbcHJlZml4U2l6ZV0pIHtcbiAgICBwcmVmaXhTaXplKys7XG4gIH1cbiAgcmV0dXJuIHByZWZpeFNpemU7XG59XG4iXX0=