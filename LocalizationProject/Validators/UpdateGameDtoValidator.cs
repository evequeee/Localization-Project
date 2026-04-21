using FluentValidation;
using LocalizationProject.Dtos;

namespace LocalizationProject.Validators;

public class UpdateGameDtoValidator : AbstractValidator<UpdateGameDto>
{
    public UpdateGameDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .Length(2, 100);
        RuleFor(x => x.OriginalLanguage)
            .NotEmpty()
            .Length(2, 3);
        RuleFor(x => x.TranslationStatus)
            .NotEmpty();
    }
}