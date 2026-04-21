using FluentValidation;
using LocalizationProject.Dtos;

namespace LocalizationProject.Validators;

public class CreateGameDtoValidator : AbstractValidator<CreateGameDto>
{
    public CreateGameDtoValidator()
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