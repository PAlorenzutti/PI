import { NgModule } from "@angular/core";
import { DateStrPipe } from "./date-str.pipe";
import { AgePipe } from "./age.pipe";
import { EnumOrderPipe } from "./enum-order.pipe";
import { DatetimeStrPipe } from "./datetime-str.pipe";

// other imports

@NgModule({
	imports: [
		// dep modules
	],
	declarations: [DateStrPipe, AgePipe, EnumOrderPipe, DatetimeStrPipe],
	exports: [DateStrPipe, AgePipe, EnumOrderPipe, DatetimeStrPipe],
})
export class PipesModule {}
